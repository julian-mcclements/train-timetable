const getOutputFilename = () => {
    const now = new Date(Date.now());
    return `${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.OUT`
};

module.exports = {
    getOutputFilename
};