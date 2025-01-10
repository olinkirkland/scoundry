import { execSync } from 'child_process';

const REPO_URL = 'https://github.com/olinkirkland/scoundry.git';
const DIST_DIR = 'dist';

try {
    // Ensure that the current branch is 'master'
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
        .toString()
        .trim();
    if (currentBranch !== 'master') {
        console.error(
            'Error: You must be on the "master" branch to deploy to master!'
        );
        process.exit(1);
    }

    console.log('Deploying to production...');

    // Execute: gh-pages -d dist
    execSync(`gh-pages -d ${DIST_DIR}`, {
        stdio: 'inherit'
    });

    console.log('Deployment to production completed successfully!');
} catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
}
