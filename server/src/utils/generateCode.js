const generateCode = () => {
    const mainStr = 'abcdefghijklmnopqrstuvwxyz'

    const shortCode = ''

    for(let i=0; i<6; i++){
        shortCode += mainStr.charAt( Math.floor (Math.random() * 62))
    }

    return shortCode
}

export default generateCode