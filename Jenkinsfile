pipeline {
    agent any

    stages {
        stage('Build Backend') {
            stages {
                stage('Backend: Install Dependencies') {
                    steps {
                        dir('Backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Backend: Unit Test') {
                    steps {
                        dir('Backend') {
                            sh 'npm test'
                        }
                    }
                }
             /*   stage('Backend: Build') {
                    steps {
                        dir('Backend') {
                            sh 'npm run build-dev'
                        }
                    }
                }*/
            }
        }

        //  les étapes pour FrontOffice et BackOffice
        /*
        stage('Build All Components') {
            parallel {
                // FrontOffice Pipeline
                stage('FrontOffice') {
                    stages {
                        stage('FrontOffice: Install Dependencies') {
                            steps {
                                dir('FrontOffice') {
                                    sh 'npm install'
                                }
                            }
                        }
                        stage('FrontOffice: Unit Test') {
                            steps {
                                dir('FrontOffice') {
                                    sh 'npm test'
                                }
                            }
                        }
                        stage('FrontOffice: Build') {
                            steps {
                                dir('FrontOffice') {
                                    sh 'npm run build-dev'
                                }
                            }
                        }
                    }
                }

                // BackOffice Pipeline
                stage('BackOffice') {
                    stages {
                        stage('BackOffice: Install Dependencies') {
                            steps {
                                dir('BackOffice') {
                                    sh 'npm install'
                                }
                            }
                        }
                        stage('BackOffice: Unit Test') {
                            steps {
                                dir('BackOffice') {
                                    sh 'npm test'
                                }
                            }
                        }
                        stage('BackOffice: Build') {
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
