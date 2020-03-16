import fs from 'fs';
import path from 'path';
import config from '../config';
import utils from '../lib';
class FileUploadService {
    /**
     * 初始化参数设置
     * @param {String} uploadPath 文件保存路径
     * @param {Boolean} rename 是否重命名同名文件，默认为true， 为false时会覆盖同名文件
     * @param {Array} types 允许的文件类型
     * */ 
    constructor(uploadPath, rename, types) {
        this.uploadPath = uploadPath || '/data';
        this.uploadDir = path.join(config.publicDir, this.uploadPath);
        this.types = types || [];
        this.rename = true;
        if (rename !=null && rename != undefined ){
            this.rename = rename;
        }
    }
    // 检查文件类型
    checkType(file) {
        // 为空时不进行校验
        if (this.types.length === 0) {
            return true;
        };
        const fileExt = file.name.split('.').pop();
        if (this.types.indexOf(fileExt) !== -1){
            return true;
        };
        return false;
    }

    // 写文件
    writeFile(file) {
        if (!this.checkType(file)) {
            return {
                code: -1,
                fileName: file.name,
                msg: '文件格式不支持'
            }
        }
        let fileName = file.name;
        let filePath = path.join(this.uploadDir, fileName);
        // 判断文件是否已存在， 是否需要重新命名
        if(fs.existsSync(filePath) && this.rename){
            const name = fileName.substring(0, fileName.lastIndexOf('.'));
            let index = 1;
            while(true){
                fileName = `${name}(${index})${ext}`
                filePath = path.join(this.uploadDir, fileName)
                if (fs.existsSync(filePath)) {
                    index += 1
                } else break
            }
        }
        const reader = fs.createReadStream(file.path);
        const writer = fs.createWriteStream(filePath);
        reader.pipe(writer)
    
        fs.unlink(file.path, (error) => {
          if (error) throw error
        });
        return {
            code: 200,
            fileName,
            filePath: `${this.uploadPath}/${fileName}`
        }

    }

    execute(ctx) {
        // 若路径不存在， 先创建路径
        utils.mkdirsSync(this.uploadDir);
        const filePaths = [];
        const files = ctx.request.files || {};

        try {
            for (const key in files) {
                const file = files[key]
                if (Object.prototype.toString.call(file) === '[Object Array]') {
                    file.forEach(item => filePaths.push(this.writeFile(item)));
                } else {
                    filePaths.push(this.writeFile(file));
                }
            }
            ctx.result = filePaths;
            } catch (error) {
            console.log(error)
            ctx.error = '服务器错误';
        }
    }
}
module.exports = FileUploadService;