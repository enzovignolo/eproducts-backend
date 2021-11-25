exports.getAll = async(Model)=>{
    try {
        const data = await Model.find({});
        return data
    } catch (err) {
        console.log(err);
        throw err;
        
    }
}

exports.getById = async (Model,id)=>{
    try {
        const data = await Model.findById(id);
        return data;
    } catch (err) {
        console.log(err);
        throw err;
        
        
    }
}
exports.createData = async(Model,newData)=>{
    try {
        const data = await Model.create(newData);
        return data;
    } catch (err) {
        console.log(err);
        throw err;
        
    }
}

exports.updateById = async(Model,id,data)=>{
    try {
        const data = await Model.findByIdAndUpdate(id,data,{new:true});
        return data
    } catch (err) {
        console.log(err);
        throw err
    }
}

exports.deleteById = async(Model,id)=>{
    try {
        await Model.findByIdAndDelete(id);
        return;
    } catch (err) {
        console.log(err);
        throw err
    }
}