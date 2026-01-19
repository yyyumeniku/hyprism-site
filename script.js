// GitHub API configuration
const GITHUB_OWNER = 'yyyumeniku';
const GITHUB_REPO = 'HyPrism';

// Fetch release info and download counts from GitHub API
async function fetchReleaseInfo() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch releases');
        }
        
        const releases = await response.json();
        
        if (releases.length === 0) {
            updateUIWithError();
            return;
        }
        
        // Find latest stable release (not pre-release)
        const latestRelease = releases.find(r => !r.prerelease) || releases[0];
        
        // Calculate total downloads across all releases
        let totalDownloads = 0;
        releases.forEach(release => {
            release.assets.forEach(asset => {
                totalDownloads += asset.download_count;
            });
        });
        
        // Update download count
        document.getElementById('total-downloads').textContent = formatNumber(totalDownloads);
        
        // Update version info
        document.getElementById('version-info').textContent = `Latest: ${latestRelease.tag_name}`;
        
        // Find download URLs for each platform
        const assets = latestRelease.assets;
        
        // Windows (.exe)
        const windowsAsset = assets.find(a => a.name.endsWith('.exe'));
        if (windowsAsset) {
            document.getElementById('download-windows').href = windowsAsset.browser_download_url;
        } else {
            document.getElementById('download-windows').style.opacity = '0.5';
            document.getElementById('download-windows').title = 'Not available';
        }
        
        // macOS (.dmg)
        const macosAsset = assets.find(a => a.name.endsWith('.dmg'));
        if (macosAsset) {
            document.getElementById('download-macos').href = macosAsset.browser_download_url;
        } else {
            document.getElementById('download-macos').style.opacity = '0.5';
            document.getElementById('download-macos').title = 'Not available';
        }
        
        // Linux (.AppImage preferred, fallback to .flatpak)
        const linuxAsset = assets.find(a => a.name.endsWith('.AppImage')) || 
                          assets.find(a => a.name.endsWith('.flatpak'));
        if (linuxAsset) {
            document.getElementById('download-linux').href = linuxAsset.browser_download_url;
        } else {
            document.getElementById('download-linux').style.opacity = '0.5';
            document.getElementById('download-linux').title = 'Not available';
        }
        
    } catch (error) {
        console.error('Error fetching release info:', error);
        updateUIWithError();
    }
}

function updateUIWithError() {
    document.getElementById('total-downloads').textContent = '—';
    document.getElementById('version-info').textContent = 'Could not load version info';
    
    // Set fallback URLs to releases page
    const fallbackUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;
    document.getElementById('download-windows').href = fallbackUrl;
    document.getElementById('download-macos').href = fallbackUrl;
    document.getElementById('download-linux').href = fallbackUrl;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchReleaseInfo);
