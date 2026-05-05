pipeline {
    agent any

    environment {
        NODE_HOME = "/home/navaneethan/.nvm/versions/node/v20.20.2/bin"
        PATH = "${NODE_HOME}:${PATH}"
        EC2_HOST = "13.233.77.247"
        EC2_USER = "ubuntu"
        DEPLOY_DIR = "/home/ubuntu/employee-portal"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '========== Stage 1: Checkout from GitHub =========='
                git branch: 'main',
                    url: 'https://github.com/navaneethan0312/employee-portal.git'
            }
        }

        stage('Build Frontend') {
            steps {
                echo '========== Stage 2: Build Frontend =========='
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo '========== Stage 2: Build Backend =========='
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                echo '========== Stage 3: Run Tests =========='
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo '========== Stage 4: Deploy to EC2 =========='
                sshagent(['ec2-ssh-key']) {

                    // Create directories on EC2
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            mkdir -p ${DEPLOY_DIR}/backend
                            sudo mkdir -p /var/www/employee-portal
                            sudo chown -R ubuntu:ubuntu /var/www/employee-portal
                        '
                    """

                    // Copy frontend build to EC2
                    sh """
                        scp -o StrictHostKeyChecking=no -r frontend/dist/* \
                        ${EC2_USER}@${EC2_HOST}:/var/www/employee-portal/
                    """

                    // Copy backend files to EC2
                    sh """
                        scp -o StrictHostKeyChecking=no -r backend/* \
                        ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}/backend/
                    """

                    // Run deployment commands on EC2
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            # Start MongoDB
                            docker start mongo || docker run -d -p 27017:27017 --name mongo mongo:latest

                            # Install backend dependencies
                            cd ${DEPLOY_DIR}/backend
                            npm install --production

                            # Restart backend with PM2
                            pm2 delete employee-backend || true
                            pm2 start server.js --name employee-backend
                            pm2 save

                            # Reload Nginx
                            sudo systemctl restart nginx

                            echo "Deployment complete!"
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo '============================================'
            echo 'Pipeline SUCCESS! App deployed to EC2!'
            echo 'Frontend: http://13.233.77.247'
            echo 'Backend:  http://13.233.77.247/api'
            echo '============================================'
        }
        failure {
            echo '============================================'
            echo 'Pipeline FAILED! Check the logs above.'
            echo '============================================'
        }
    }
}
