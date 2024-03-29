import { Link } from "react-router-dom"
import 'linkify-plugin-mention'

export function createImagePlaceholderUrl(path, size) {
    if (path.indexOf('cloudfront.net') > -1) {
        path = path.slice(path.indexOf('cloudfront.net') + 14,)
    }
    const awsDomainOnlyForImages =
        "https://d1kll7zdtk3qm0.cloudfront.net"
    const first_part_of_path = path.slice(0, path.lastIndexOf('/'))
    const image_name = path.slice(path.lastIndexOf('/'),)
    const url = (
        awsDomainOnlyForImages +
        first_part_of_path +
        '/fit-in/' +
        size +
        image_name)
    return url
}

export function createImageSrcUrl(path) {
    const awsDomainOnlyForImages = "https://d1kll7zdtk3qm0.cloudfront.net"
    return awsDomainOnlyForImages + path
}

export function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            resolve(fileReader.result);
        }
        fileReader.onerror = (error) => {
            reject(error);
        }
    })
}


export function getFinalStringForNumber(number) {
    const numberStr = number.toString()
    if (number < 1000) {
        return numberStr
    } else if (number < 10000) {
        return numberStr[0] + ' ' + numberStr.slice(1,)
    }
    const numberOfDigits = number.toString().length
    var divider = 1000
    var abbr = 'K'
    if (numberOfDigits > 6) {
        divider = 1000000
        abbr = 'M'
    }
    const value = Math.floor((number / divider) * 10) / 10
    if (value.toString().length > 4) {
        return Math.floor(value).toString() + abbr
    } else {
        return value.toString() + abbr
    }
}

export function getDateCreatedPostCard(string) {
    const d = new Date(string)
    const yearNow = new Date().getFullYear()
    if (d.getFullYear() < yearNow) {
        return d.toLocaleDateString(
            'en-us', { day: 'numeric', month: 'short', year: 'numeric' })
    } else {
        var seconds = Math.floor((new Date() - d) / 1000);
        var interval = seconds / 86400;
        if (interval > 1) {
            return d.toLocaleDateString(
                'en-us', { day: 'numeric', month: 'short' })
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + "h";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + "m";
        }
        return Math.floor(seconds) + "s";
    }
}


export function getDateJoined(string) {
    const d = new Date(string)
    return d.toLocaleDateString(
        'en-us', { day: 'numeric', month: 'long', year: 'numeric' })
}


export function handleText(text, fromPostDetail = null, fromPostCard = false) {

    function getTruncatedStringWithSeveralLines(string, addEllipsis = false) {
        if (string.indexOf('\n') !== -1) {
            const position = string.split('\n', 5).join('\n').length
            string = string.slice(
                0, position)
            return string + ((position !== text.length || addEllipsis) ? ' ...' : '')
        } else {
            return string + (addEllipsis ? ' ...' : '')
        }
    }

    if (fromPostDetail !== true && fromPostCard) {
        if (text.length > 350) {
            text = text.slice(0, 350)
            return getTruncatedStringWithSeveralLines(text, true)
        } else {
            return getTruncatedStringWithSeveralLines(text)
        }
    } else {
        return text
    }
}


export function handleTextOnCreation(text) {
    var editedText = text.replace(/^\s*\n/gm, '\n')
    if (editedText.startsWith('\n')) {
        editedText = editedText.slice(1)
    }
    if (editedText.endsWith('\n\n')) {
        editedText = editedText.slice(0, -2)
    }
    if (editedText.endsWith('\n')) {
        editedText = editedText.slice(0, -1)
    }
    editedText = editedText.replace(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm,
        function (url) {
            if (url.endsWith('/')) {
                return url.slice(0, -1)
            }
            return url
        });
    if (editedText.includes('http')) {
        editedText = editedText.replace(/https?:\/\/(www\.)?/gmi, "");
    }
    return editedText
}


const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return <Link 
        to={'/profile' + href.toLowerCase()} {...props}>{content}</Link>;
};

export const optionsForTextInCards = {
    render: {
        mention: renderLink,
    },
    attributes: {
        onClick: (event) => {
            event.stopPropagation()
        }
    }
};