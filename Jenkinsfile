pipeline {
    agent any
    
    environment {
        registryCredentials = "nexus"
        registry = "192.168.65.129:8083"
        DOCKER_IMAGE = "${registry}/backend:6.0"
    }

    stages {
        stage('Build Backend') {
            stages {
                stage('Install Dependencies') {
                    steps {
                        dir('Backend') {
                            sh 'npm install'
                        }
                    }
                }
                
                stage('Fix Permissions') {
                    steps {
                        dir('Backend') {
                            sh 'chmod +x node_modules/.bin/mocha'
                        }
                    }
                }

                stage('Run Unit Tests') {
                    steps {
                        dir('Backend') {
                            sh 'npm test'
                        }
                    }
                }

                stage('SonarQube Analysis') {
                    steps {
                        dir('Backend') {
                            script {
                                def scannerHome = tool name: 'scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                                withSonarQubeEnv('scanner') {
                                    sh """
                                        ${scannerHome}/bin/sonar-scanner \
                                        -Dproject.settings=./sonar-project.properties \
                                        -Dsonar.working.directory=.scannerwork
                                    """
                                }
                            }
                        }
                    }
                }

                stage('Build Docker Images') {
                    steps {
                        dir('Backend') {
                            script {
                                sh 'docker-compose build --no-cache --pull app'
                            }
                        }
                    }
                }

                stage('Deploy to Nexus') {
                    steps {
                        dir('Backend') {
                            script {
                                docker.withRegistry("http://${registry}", registryCredentials) {
                                    sh "docker push ${DOCKER_IMAGE}"
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Run Application') {
            steps {
                dir('Backend') {
                    script {
                        docker.withRegistry("http://${registry}", registryCredentials) {
                            sh """
                                docker-compose down --volumes --remove-orphans
                                docker-compose pull
                                docker-compose up -d --force-recreate --build
                            """
                        }
                    }
                }
            }
        }

        /* Décommenter pour build FrontOffice et BackOffice */
        /*
        stage('Build All Components') {
            parallel {
                stage('Build FrontOffice') {
                    stages { ... }
                }
                stage('Build BackOffice') {
                    stages { ... }
                }
            }
        }
        */
    }
}
