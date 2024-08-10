const axios = require('axios');

export const getGitRepoDetails = async (url: string) => {
    try {
        const response = await axios.get(url);
        const data = response.data;

        // Latest commit hash
        const LatestCommitHash = await getLatestCommitHash(url + "/commits").catch(() => '');
        // Demo URL
        const demoUrl = data["homepage"] || '';
        // Authenticated URL
        const authenticatedUrl = await getAuthenticatedUrl(data["deployments_url"]).catch(() => '');
        // Real App URL
        const realAppUrl = await getRealAppURL(url, authenticatedUrl).catch(() => '');
        // Total Commits
        const totalCommits = await getTotalCommits(url + "/commits").catch(() => 0);

        return [LatestCommitHash, demoUrl, realAppUrl, authenticatedUrl, totalCommits];
    } catch (error) {
        console.error('Error fetching repository details:', error);
        return ['', '', '', '', 0];
    }
}

const getLatestCommitHash = async (url: string) => {
    try {
        const commitUrl = await axios.get(url);
        return commitUrl.data[0].sha;
    } catch (error) {
        console.error('Error fetching latest commit hash');
        return '';
    }
}

const getAuthenticatedUrl = async (url: string) => {
    try {
        const deployments_url = await axios.get(url);
        const statuses_url = await axios.get(deployments_url.data[0].statuses_url);
        return statuses_url.data[0].target_url;
    } catch (error) {
        console.error('Error fetching authenticated URL');
        return '';
    }
}

const getRealAppURL = async (url: string, authenticatedUrl: string) => {
    try {
        if (!authenticatedUrl) {
            return '';
        }
        const branchesUrl = await axios.get(url);
        const branch = branchesUrl.data["default_branch"];
        // console.log(branch)

        // Split the URL into parts
        const urlParts = authenticatedUrl.split('-');

        // Filter out the first part and the last two parts
        const potentialHashes = urlParts.slice(1, -1);

        // Identify parts with a length of 9
        const hashCandidates = [];
        for (const part of potentialHashes) {
            if (part.length === 9) {
                hashCandidates.push(part);
            }
        }
        // console.log(hashCandidates);

        if (hashCandidates.length === 1) {
            // Replace the unique identifier with the branch name
            const hashIndex = urlParts.indexOf(hashCandidates[0]);
            urlParts[hashIndex] = `git-${branch}`;
            // Join the parts back into a full URL
            const realUrl = urlParts.join('-');
            return realUrl;
        } else {
            return `Replace git-${branch} with the weird hash in the authenticated URL: ${authenticatedUrl}`;
        }
    } catch (error) {
        console.error('Error fetching real app URL');
        return '';
    }
}

const getTotalCommits = async (url: string) => {
    try {
        const response = await axios.get(url);
        const data = response.data;

        const jsonString = JSON.stringify(data);
        const verificationCount = (jsonString.match(/"verification"/g) || []).length;

        return verificationCount;
    } catch (error) {
        console.error('Error fetching total commits');
        return 0;
    }
}

// const result = getGitRepoDetails("https://api.github.com/repos/0xScratch/Nexbizn");
// result.then(res => console.log(res)).catch(err => console.error(err));