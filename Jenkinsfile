pipeline {
    agent any

    environment {
        NODE_HOME  = "/home/navaneethan/.nvm/versions/node/v20.20.2/bin"
        PATH       = "${NODE_HOME}:${PATH}"
        EC2_HOST   = "13.206.221.80"
        EC2_USER   = "ubuntu"
        DEPLOY_DIR = "/home/ubuntu/employee-portal"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '========== Stage 1: Checkout =========='
                git branch: 'master',
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
                echo '========== Stage 3: Build Backend =========='
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                echo '========== Stage 4: Run Tests =========='
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo '========== Stage 5: Deploy to EC2 =========='
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no \
                            -o ServerAliveInterval=60 \
                            -o ServerAliveCountMax=10 \
                            ubuntu@13.206.221.80 bash -s << 'ENDSSH'
                        set -e

                        echo "Node version: $(node -v)"
                        echo "NPM version: $(npm -v)"
                        echo "PM2 version: $(pm2 -v)"

                        echo "--- Step 1: Pull latest code ---"
                        if [ -d "/home/ubuntu/employee-portal/.git" ]; then
                            echo "Git repo found - pulling latest..."
                            cd /home/ubuntu/employee-portal
                            git remote set-url origin https://github.com/navaneethan0312/employee-portal.git
                            git fetch origin
                            git reset --hard origin/master
                        elif [ -d "/home/ubuntu/employee-portal" ]; then
                            echo "Folder exists but not git repo - recloning..."
                            rm -rf /home/ubuntu/employee-portal
                            git clone https://github.com/navaneethan0312/employee-portal.git /home/ubuntu/employee-portal
                        else
                            echo "Fresh install - cloning..."
                            git clone https://github.com/navaneethan0312/employee-portal.git /home/ubuntu/employee-portal
                        fi

                        echo "--- Step 2: Install backend dependencies ---"
                        cd /home/ubuntu/employee-portal/backend
                        npm install --production --silent

                        echo "--- Step 3: Build frontend ---"
                        cd /home/ubuntu/employee-portal/frontend
                        npm install --silent
                        npm run build

                        echo "--- Step 4: Copy frontend to Nginx ---"
                        sudo mkdir -p /var/www/employee-portal
                        sudo cp -r /home/ubuntu/employee-portal/frontend/dist/* /var/www/employee-portal/
                        sudo chown -R www-data:www-data /var/www/employee-portal

                        echo "--- Step 5: Start MongoDB ---"
                        docker start mongo 2>/dev/null || docker run -d \
                            -p 27017:27017 \
                            --name mongo \
                            --restart always \
                            mongo:latest

                        echo "--- Step 6: Restart backend with PM2 ---"
                        pm2 delete employee-backend 2>/dev/null || true
                        pm2 start /home/ubuntu/employee-portal/backend/server.js --name employee-backend
                        pm2 save

                        echo "--- Step 7: Reload Nginx ---"
                        sudo systemctl reload nginx

                        echo "--- Deployment complete! ---"
                        pm2 list
ENDSSH
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '============================================'
            echo 'Pipeline SUCCESS!'
            echo 'Frontend : http://65.2.171.107'
            echo 'Backend  : http://65.2.171.107/api'
            echo '============================================'
        }
        failure {
            echo '============================================'
            echo 'Pipeline FAILED! Check logs above.'
            echo '============================================'
        }
    }
}
