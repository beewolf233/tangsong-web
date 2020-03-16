class BaseDAO {
    /**
     * 构造方法
     * @param {function} model mongoose model对象，初始化时必须
     */
    constructor(model) {
      this.model = model
    }
    /**
      * 条件查询，单个结果
      * @param {Object} condition 查询条件
      * @return {Object | null} 查询结果,为空时返回null
      */
    async findOne(condition) {
      const result = await this.model.findOne(condition)
      return result
    }
    /**
     * 条件查询，多个结果
     * @param {Object} condition 查询条件
     * @return {Array} 查询结果
     */
    async findMany(condition) {
      const result = await this.model.find(condition)
      return result
    }
    /**
     * 分页查询
     * @param {Object} condition 查询条件
     * @param {Object} pageNum 页码，默认1
     * @param {Object} pageSize 每页数据量，默认10
     * @return {Array} 查询结果
     */
    async findByPage(condition = {}, pageNum = 1, pageSize = 10) {
      const count = await this.model.countDocuments(condition)
      const list = await this.model.find(condition)
        .skip((parseInt(pageNum) - 1) * parseInt(pageSize))
        .limit(parseInt(pageSize))
        .sort({ _id: -1 })
        .exec()
      return { count, list }
    }
    /**
     * id查询
     * @param {String} id 
     * @return {Object} 查询结果
     */
    async findById(id) {
      const result = await this.model.findById(id)
      return result
    }
    /**
     * id删除
     * @param {String} id
     * @return {Object} 查询结果
     */
    async deleteById(id) {
      const result = await this.model.findByIdAndRemove(id)
      return result
    }
    /**
     * id更新
     * @param {String} id
     * @return {Object} 查询结果
     */
    async updateById(id, data, options) {
      const result = await this.model.findByIdAndUpdate(id, data, options)
      return result
    }
    /**
     * 新增
     * @param {Object} data Json数据
     * @return {Object} 新增的数据
     */
    async save(data) {
      const instance = new this.model(data)
      const result = await instance.save()
      return result
    }
    /**
     * 批量删除
     * @param {Object} condition 条件
     */
    async delete(condition) {
      const result = await this.model.deleteMany(condition)
      return result
    }
    /**
     * 批量更新
     * @param {Object} condition 条件
     * @param {Object} data 数据
     * @param {Object} options 配置项
     */
    async update(condition, data, options) {
      const result = await this.model.updateMany(condition, data, options)
      return result
    }
  }
  
  module.exports = BaseDAO
  