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
                git branch: 'main',
                    url: 'https://github.com/navaneethan0312/employee-portal.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << 'ENDSSH'
                            set -e

                            echo "--- Step 1: Pull latest code from GitHub ---"
                            if [ -d "${DEPLOY_DIR}/.git" ]; then
                                cd ${DEPLOY_DIR}
                                git pull ect master
                            else
                                git clone https://github.com/navaneethan0312/employee-portal.git ${DEPLOY_DIR}
                            fi

                            echo "--- Step 2: Build Frontend ---"
                            cd ${DEPLOY_DIR}/frontend
                            npm install --silent
                            npm run build

                            echo "--- Step 3: Copy frontend to Nginx ---"
                            sudo cp -r ${DEPLOY_DIR}/frontend/dist/* /var/www/employee-portal/

                            echo "--- Step 4: Install backend dependencies ---"
                            cd ${DEPLOY_DIR}/backend
                            npm install --production --silent

                            echo "--- Step 5: Start MongoDB ---"
                            docker start mongo 2>/dev/null || docker run -d -p 27017:27017 --name mongo mongo:latest

                            echo "--- Step 6: Restart backend with PM2 ---"
                            pm2 delete employee-backend 2>/dev/null || true
                            pm2 start server.js --name employee-backend
                            pm2 save

                            echo "--- Step 7: Reload Nginx ---"
                            sudo systemctl reload nginx

                            echo "Deployment complete!"
ENDSSH
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline SUCCESS!'
            echo 'Frontend: http://13.233.77.247'
            echo 'Backend:  http://13.233.77.247/api'
        }
        failure {
            echo 'Pipeline FAILED! Check the logs'
        }
    }
}
EOF
