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
                git branch: 'mster',
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
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no \
                            -o ServerAliveInterval=60 \
                            -o ServerAliveCountMax=10 \
                            ${EC2_USER}@${EC2_HOST} bash << 'ENDSSH'
                        set -e

                        echo "--- Step 1: Pull latest code from GitHub ---"
                        if [ -d "${DEPLOY_DIR}/.git" ]; then
                            cd ${DEPLOY_DIR}
                            git fetch emp
                            git reset --hard emp/master
                        else
                            git clone https://github.com/navaneethan0312/employee-portal.git ${DEPLOY_DIR}
                            cd ${DEPLOY_DIR}
                        fi

                        echo "--- Step 2: Install backend dependencies ---"
                        cd ${DEPLOY_DIR}/backend
                        npm install --production --silent

                        echo "--- Step 3: Build frontend ---"
                        cd ${DEPLOY_DIR}/frontend
                        npm install --silent
                        npm run build

                        echo "--- Step 4: Deploy frontend to Nginx ---"
                        sudo mkdir -p /var/www/employee-portal
                        sudo cp -r ${DEPLOY_DIR}/frontend/dist/* /var/www/employee-portal/
                        sudo chown -R www-data:www-data /var/www/employee-portal

                        echo "--- Step 5: Start MongoDB ---"
                        docker start mongo 2>/dev/null || docker run -d \
                            -p 27017:27017 \
                            --name mongo \
                            --restart always \
                            mongo:latest

                        echo "--- Step 6: Restart backend with PM2 ---"
                        pm2 delete employee-backend 2>/dev/null || true
                        pm2 start ${DEPLOY_DIR}/backend/server.js --name employee-backend
                        pm2 save
                        pm2 startup || true

                        echo "--- Step 7: Reload Nginx ---"
                        sudo systemctl reload nginx

                        echo ""
                        echo "Deployment complete!"
                        echo "PM2 Status:"
                        pm2 list
ENDSSH
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline SUCCESS!'
            echo 'Frontend : http://13.233.77.247'
            echo 'Backend  : http://13.233.77.247/api'
        }
        failure {
            echo 'Pipeline FAILED! Check logs above.'
        }
    }
}
