import fs from 'fs/promises';
import path from 'path';
import { buffer } from 'stream/consumers';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MediaManger
{

    async getPathAndType(file, lessonID) {
        const originalName = file.originalname;
        const fileType = file.mimetype.split('/')[0];
        const fileExt = path.extname(originalName);
        const newFileName = `${uuidv4()}${fileExt}`;
        const filePath = path.join(__dirname, `../uploads/lessons/${lessonID}/${newFileName}`);

        return { path: filePath, type: fileType, buffer: file.buffer };
    }
    
    async saveFile(file, filePath)
    {
        try
        {
            const uploadDir = path.dirname(filePath);

            await fs.mkdir(uploadDir, {recursive: true});
            const bufferData = Buffer.from(file);

            await fs.writeFile(filePath, bufferData);
    
            return true;
        }
        catch(error)
        {
            console.error("Error in saveFile:", error.message);
            return false;
        }
    }

    async deleteFile(filePath)
    {
        try
        {
            await fs.unlink(filePath);
            return true;
        }
        catch(error)
        {
            console.error("Error in deleteFile:", error.message);
            return false;
        }
    }

    async deleteDirectory(lessonID)
    {
        try
        {
            const dirPath = path.join(__dirname, `../uploads/lessons/${lessonID}`);
            await fs.rm(dirPath, { recursive: true });
            return true ;
        }
        catch(error)
        {
            console.error("Error in deleteDirectory:", error.message);
            return false;
        }
    }
}

export default new MediaManger();