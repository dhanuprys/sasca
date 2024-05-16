node {
    stage('Clone Repository') {
        // Checkout your source code repository
        checkout scm
    }

    stage('Build Docker Image') {
        // Define the Docker image name and tag
        def frontendDockerImageName = 'scr.stemsi.cloud/sasca-frontend:latest'
        def backendDockerImageName = 'scr.stemsi.cloud/sasca-backend:latest'

        // Build Docker image
        script {
            docker.withRegistry('https://scr.stemsi.cloud', 'docker-stemsi') {
                def customImage = docker.build(frontendDockerImageName, '-f ./frontend/Dockerfile ./frontend')

                // Push the Docker image to the registry
                customImage.push()
            }

            docker.withRegistry('https://scr.stemsi.cloud', 'docker-stemsi') {
                def customImage = docker.build(backendDockerImageName, '-f ./backend/Dockerfile ./backend')

                // Push the Docker image to the registry
                customImage.push()
            }
        }
    }

    stage('Deploy via SSH') {
        withCredentials([string(credentialsId: 'jenkins-client', variable: 'SSH_PASSWORD')]) {
            // Run a Docker container based on the Ubuntu image
            def containerId = sh(returnStdout: true, script: 'docker run -d ringcentral/sshpass:latest tail -f /dev/null').trim()

            // Define SSH connection details
            def sshHost = 'stemsi.my.id'
            def sshUser = 'jenkins-client'
            def sshPort = '2192'

            // Define the command to execute over SSH
            def sshCommand = 'cd /applications/sasca && ./update-only.sh'

            // Execute the SSH command using sshpass inside the container
            sh "docker exec ${containerId} sshpass -v -p '${SSH_PASSWORD}' ssh -o StrictHostKeyChecking=no ${sshUser}@${sshHost} -p ${sshPort} '${sshCommand}'"
            // sh "docker exec public_server_remote echo 'ayamgoreng' | ssh -o StrictHostKeyChecking=no ${sshUser}@${sshHost} -s -p ${sshPort} '${sshCommand}'"

            // Stop and remove the Docker container
            sh "docker stop ${containerId}"
            sh "docker rm ${containerId}"
        }
    }
}