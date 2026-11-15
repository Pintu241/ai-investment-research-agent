pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    triggers {
        githubPush()
    }

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Git branch to build and deploy')
        booleanParam(name: 'DEPLOY_TO_EC2', defaultValue: true, description: 'Deploy to AWS EC2 instance?')
        string(name: 'EC2_DEPLOY_PATH', defaultValue: '/home/ubuntu/ai-investment-research-agent', description: 'Target deployment path on EC2')
    }

    environment {
        APP_NAME = 'ai-investment-research-agent'
        SERVER_DIR = 'server'
        CLIENT_DIR = 'client'
        CI = 'true'
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo '===> [Stage 1/7] Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '===> [Stage 2/7] Installing dependencies...'
                echo 'Installing Backend dependencies...'
                dir("${env.SERVER_DIR}") {
                    sh 'npm ci --prefer-offline --no-audit || npm install'
                }
                echo 'Installing Frontend dependencies...'
                dir("${env.CLIENT_DIR}") {
                    sh 'npm ci --prefer-offline --no-audit || npm install'
                }
            }
        }

        stage('Lint & Code Quality') {
            steps {
                echo '===> [Stage 3/7] Running code quality and lint checks...'
                dir("${env.CLIENT_DIR}") {
                    sh 'npm run lint'
                }
            }
        }

        stage('Backend Validation & Tests') {
            steps {
                echo '===> [Stage 4/7] Validating backend syntax and integrity...'
                dir("${env.SERVER_DIR}") {
                    sh 'npm test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '===> [Stage 5/7] Building React production distribution bundle...'
                dir("${env.CLIENT_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Image Build') {
            steps {
                echo '===> [Stage 6/7] Building and validating Docker images...'
                sh 'docker compose build --pull'
            }
        }

        stage('Deploy to AWS EC2') {
            when {
                expression {
                    return params.DEPLOY_TO_EC2 && (env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'origin/main')
                }
            }
            steps {
                echo '===> [Stage 7/7] Deploying application to AWS EC2...'
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    ),
                    string(credentialsId: 'EC2_HOST', variable: 'EC2_HOST'),
                    string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI'),
                    string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_API_KEY'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                    string(credentialsId: 'VITE_API_URL', variable: 'VITE_API_URL')
                ]) {
                    sh '''
                        set -e
                        echo "Configuring SSH connection to EC2..."
                        SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ${SSH_KEY}"

                        echo "Creating deployment directory on EC2 at ${params.EC2_DEPLOY_PATH}..."
                        ssh ${SSH_OPTS} ${SSH_USER}@${EC2_HOST} "mkdir -p ${params.EC2_DEPLOY_PATH}/scripts"

                        echo "Transferring project files to EC2..."
                        rsync -avz -e "ssh ${SSH_OPTS}" \
                            --exclude 'node_modules' \
                            --exclude '.git' \
                            --exclude '.env' \
                            --exclude 'dist' \
                            ./ ${SSH_USER}@${EC2_HOST}:${params.EC2_DEPLOY_PATH}/

                        echo "Setting up production environment and restarting containers on EC2..."
                        ssh ${SSH_OPTS} ${SSH_USER}@${EC2_HOST} "bash -s" << REMOTE_DEPLOY_EOF
                            set -e
                            cd ${params.EC2_DEPLOY_PATH}

                            cat << 'EOF' > .env
PORT=5000
MONGO_URI=${MONGO_URI}
GEMINI_API_KEY=${GEMINI_API_KEY}
JWT_SECRET=${JWT_SECRET}
VITE_API_URL=${VITE_API_URL}
EOF
                            chmod 600 .env

                            chmod +x scripts/*.sh

                            bash scripts/deploy.sh
REMOTE_DEPLOY_EOF

                        echo "Post-deployment verification passed!"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo '===> Cleaning up temporary workspace files...'
            cleanWs(deleteDirs: true, notFailBuild: true)
        }
        success {
            echo '========================================================'
            echo '  CI/CD PIPELINE SUCCEEDED! All stages completed.'
            echo '========================================================'
        }
        failure {
            echo '========================================================'
            echo ' [X] CI/CD PIPELINE FAILED! Please check logs above.'
            echo '========================================================'
        }
    }
}

