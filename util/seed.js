const STATUS = {
    ACTIVE: 'ACTIVE',
    COMPLETE: 'COMPLETE',
    DELETED: 'DELETED'
};

const todos = {
    1: { title: 'Learn JS', status: STATUS.ACTIVE },
    2: { title: 'Git Tutorial', status: STATUS.ACTIVE },
    3: { title: 'Interactive Git', status: STATUS.ACTIVE }
};


module.exports = {
    STATUS,
    todos,
    next_Id: 4
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
