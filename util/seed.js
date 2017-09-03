const STATUS = {
    ACTIVE: 'ACTIVE',
    COMPLETE: 'COMPLETE',
    DELETED: 'DELETED'
};

const todos = {
};


module.exports = {
    STATUS,
    todos,
    next_Id: 1
};

module.exports.getValidStatus = (input) => {
    console.log(input);
    let status = input;
    if (typeof status === 'string') {
        status = status.toUpperCase().trim();
        if (!(status === STATUS.ACTIVE || status === STATUS.DELETED 
            || status === STATUS.COMPLETE)) {
            status = undefined;
        }
    }
    return status;
};
