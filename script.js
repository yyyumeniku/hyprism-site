const GITHUB_OWNER = 'yyyumeniku';
const GITHUB_REPO = 'HyPrism';

// Truncate long names
function truncateName(name, maxLen = 10) {
    return name.length > maxLen ? name.slice(0, maxLen) + '...' : name;
}

// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
}

// Fetch and display contributors
async function fetchContributors() {
    const container = document.getElementById('contributors');
    
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors`);
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const contributors = await response.json();
        
        container.innerHTML = contributors.map(c => `
            <a href="${c.html_url}" target="_blank" rel="noopener" class="contributor" title="${c.login} - ${c.contributions} contributions">
                <img src="${c.avatar_url}" alt="${c.login}" loading="lazy">
                <span>${truncateName(c.login)}</span>
            </a>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<div class="loading">Could not load contributors</div>';
    }
}

// Fetch download count
async function fetchDownloadCount() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const releases = await response.json();
        let total = 0;
        releases.forEach(r => r.assets.forEach(a => total += a.download_count));
        
        document.getElementById('total-downloads').textContent = formatNumber(total);
    } catch (error) {
        document.getElementById('total-downloads').textContent = '—';
    }
}

// Fetch download URLs
async function fetchDownloads() {
    // The names of the files we are looking for
    const filenames = {
        windows: 'HyPrism.exe',
        mac: 'HyPrism-macOS-arm64.dmg',
        linuxAppImage: 'HyPrism-x86_64.AppImage',
        linuxFlatpak: 'HyPrism.flatpak',
        linuxTar: 'HyPrism-linux-x86_64.tar.gz'
    };

	// Generate "direct" links in case the API fails
	// This is the standard GitHub path for downloading files from the LATEST STABLE release
    const baseUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest/download/`;
    
    let links = {
        windows: baseUrl + filenames.windows,
        mac: baseUrl + filenames.mac,
        linux: baseUrl + filenames.linuxAppImage // Default AppImage
    };

    try {
        // Use ?per_page=1 instead of /latest to see pre-release versions as well
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases?per_page=1`);
        
        if (!response.ok) throw new Error('API request failed');
        
        const releases = await response.json();
        if (!releases || releases.length === 0) throw new Error('No releases found');
        
        const latestRelease = releases[0]; // We take the latest release (even if it is a preliminary version)
        const assets = latestRelease.assets;
        
        // Windows
        const winAsset = assets.find(a => a.name === filenames.windows);
        if (winAsset) links.windows = winAsset.browser_download_url;
        
        // macOS
        const macAsset = assets.find(a => a.name === filenames.mac);
        if (macAsset) links.mac = macAsset.browser_download_url;
        
        // Linux
        const appImage = assets.find(a => a.name === filenames.linuxAppImage);
        const flatpak = assets.find(a => a.name === filenames.linuxFlatpak);
        const tar = assets.find(a => a.name === filenames.linuxTar);
        
        if (appImage) links.linux = appImage.browser_download_url;
        else if (flatpak) links.linux = flatpak.browser_download_url;
        else if (tar) links.linux = tar.browser_download_url;
        
    } catch (error) {
        console.warn('GitHub API fetch failed, falling back to direct links.', error);
        // We do not change the links to the releases page, we leave the generated direct links
    }

    // Apply links to buttons
    document.getElementById('download-windows').href = links.windows;
    document.getElementById('download-macos').href = links.mac;
    document.getElementById('download-linux').href = links.linux;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    fetchContributors();
    fetchDownloads();
    fetchDownloadCount();
});