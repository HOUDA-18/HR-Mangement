pipeline {
    agent any
    
    environment {
        registryCredentials = "nexus"
        registry = "192.168.65.129:8070"
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
                                sh 'docker-compose build'
                            }
                        }
                    }
                }

                stage('Deploy to Nexus') {
                    steps {
                        dir('Backend') {
                            script {
                                docker.withRegistry("http://${registry}", registryCredentials) {
                                    sh 'docker push $registry/nodemongoapp:5.0'
                                }
                            }
                        }
                    }
                }
            }
        }

        /* Uncomment if you want to build FrontOffice and BackOffice */
        /*
        stage('Build All Components') {
            parallel {
                stage('Build FrontOffice') {
                    stages {
                        stage('Install Dependencies') {
                            steps {
                                dir('FrontOffice') {
                                    sh 'npm install'
                                }
                            }
                        }
                        stage('Run Unit Tests') {
                            steps {
                                dir('FrontOffice') {
                                    sh 'npm test'
                                }
                            }
                        }
                        stage('Build Application') {
                            steps {
                                dir('FrontOffice') {
                                    sh 'npm run build-dev'
                                }
                            }
                        }
                    }
                }

                stage('Build BackOffice') {
                    stages {
                        stage('Install Dependencies') {
                            steps {
                                dir('BackOffice') {
                                    sh 'npm install'
                                }
                            }
                        }
                        stage('Run Unit Tests') {
                            steps {
                                dir('BackOffice') {
                                    sh 'npm test'
                                }
                            }
                        }
                        stage('Build Application') {
                            steps {
                                dir('BackOffice') {
                                    sh 'npm run build-dev'
                                }
                            }
                        }
                    }
                }
            }
        }
        */
    }
}
