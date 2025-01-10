import { execSync } from 'child_process';

const REPO_URL = 'https://github.com/olinkirkland/scoundry-lab.git';
const DIST_DIR = 'dist';

try {
    // Ensure that the current branch is 'staging'
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
        .toString()
        .trim();
    if (currentBranch !== 'staging') {
        console.error(
            'Error: You must be on the "staging" branch to deploy to staging!'
        );
        process.exit(1);
    }

    console.log('Deploying to staging repository...');

    // Check if the `dist` directory exists
    execSync(
        `test -d ${DIST_DIR} || (echo "Error: ${DIST_DIR} does not exist!" && exit 1)`
    );

    // Add the staging repository as a remote (if not already added)
    try {
        execSync(`git remote add staging-repo ${REPO_URL}`);
    } catch (e) {
        console.log('Remote "staging-repo" already exists.');
    }

    // Temporarily add `dist` to Git index even if it's ignored
    console.log('Temporarily adding dist directory to Git index...');
    execSync(`git add -f ${DIST_DIR}`);

    // Commit the dist changes
    console.log('Committing dist directory changes...');
    execSync('git commit -m "Deploy dist directory to gh-pages"', { stdio: 'inherit' });

    // Push the subtree (without --squash)
    console.log('Pushing dist directory to staging repo gh-pages...');
    execSync(
        `git subtree push --prefix=${DIST_DIR} staging-repo gh-pages`,
        { stdio: 'inherit' }
    );

    // Remove `dist` from the index to respect .gitignore
    console.log('Cleaning up: removing dist from Git index...');
    execSync(`git reset ${DIST_DIR}`);

    console.log('Deployment to staging completed successfully!');
} catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
}
