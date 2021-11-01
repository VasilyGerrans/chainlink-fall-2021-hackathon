export function ellipsisAddress(address = '', width = 10) {
    if (!address) {
        return '';
    }
    return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function fixNFTURL(url) {
    if (url === "" || url ==="#" || url === undefined || url === null) {
        return "#";
    }
    else if (url.startsWith("ipfs://ipfs/")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://ipfs/").slice(0)[1];
    }
    else if (url.startsWith("ipfs")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(0)[1];
    }
    else {
        return url + "?format=json";
    }
}