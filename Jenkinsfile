
pipeline {
    agent any

    environment {
        EC2_HOST = '13.232.2.199'
        EC2_USER = 'ubuntu'
        PROJECT_DIR = '/home/ubuntu/ai-investment-research-agent'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd ${PROJECT_DIR} &&
                            git pull origin main &&
                            docker compose config -q &&
                            docker compose up -d --build &&
                            docker compose ps
                        '
                    """
                }
            }
        }
    }
}
