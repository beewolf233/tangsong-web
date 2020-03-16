import FileUploadService from './fileUploadService';
/**
 * 继承子文件上传类 改变上传路径和允许文件类型
 * */ 
class ImgUploadService extends FileUploadService {
    constructor(uploadPath = '/img', rename, types = ['png', 'jpg', 'jpeg']) {
        super(uploadPath, rename, types);
    }
};
module.exports = ImgUploadService;