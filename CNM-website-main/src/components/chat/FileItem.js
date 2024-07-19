import styled from 'styled-components';
import { FaRegFileWord, FaRegFilePdf, FaRegFile } from "react-icons/fa";
import { LuFileJson, LuFileVideo } from "react-icons/lu";
import { AiOutlineDownload } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import fileApi from '../../api/fileApi';

const FileItemStyled = styled.div`
	display: flex;
    align-items: center;
`;

const FileIconStyled = styled.div`
	font-size: 3rem;
	display: flex;
    align-items: center;
    margin-left: -0.4rem;
`;

const FileDetailStyled = styled.div`
	display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    padding-left: 0.6rem;
    overflow: hidden;

    h5 {
        font-size: 1rem;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`;

const FileDetailBottomStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
        font-size: 0.8rem;
        color: #7589a3;
    }
`;

const DownloadFileIconStyled = styled.div`
    font-size: 1.4rem;
    background-color: white;
    width: 24px;
    height: 24px;
    line-height: 24px;
    color: rgb(33, 37, 41); 
    text-align: center;
    border-radius: 6px;
    &:hover {
        background-color: var(--button-tertiary-neutral-hover);
    }
`;

const VideoItemStyled = styled.div`
    background-color: black;
    margin-bottom: 0.8rem;
    border-radius: 0.5rem;
    padding-bottom: 0;
    height: 14rem;
    overflow: hidden;


    video{
        width: 100%;
        height: 100%;
    }
`;

const hanldleDownloadFile = async (e, fileNameS3, fileName) => {
    e.stopPropagation();    
    try {
        const res = await fileApi.getFileBuffer(fileNameS3);
        const handleChooseFolder = await window.showSaveFilePicker({ suggestedName: fileName });

        const writableStream = await handleChooseFolder.createWritable();
        await writableStream.write(new Blob( [new Uint8Array(res.data.data)] ));
        await writableStream.close();
    } catch (error) {
        console.log(error);
    }
}

const FileItem = ({fileName, fileSize, fileNameS3, className, onClick, fileURL}) => {
    const file = fileName.split(".")
    const fileType = file[file.length - 1]
    return (
        <div className={className} onClick={onClick}>
            {fileType === "mp4" && (
                <VideoItemStyled>
                    <video src={fileURL} controls></video>
                </VideoItemStyled>
            )}
            <FileItemStyled>
                <FileIconStyled>
                    {
                        fileType === "docx" ? <FaRegFileWord/> 
                        : (fileType === "json" ? <LuFileJson /> 
                        : (fileType === "pdf" ? <FaRegFilePdf /> 
                        : (fileType === "txt" ? <FiFileText />
                        : (fileType === "mp4" ? <LuFileVideo />
                        : <FaRegFile />))))
                    }   
                </FileIconStyled>
                <FileDetailStyled>
                    <h5>{fileName}</h5>
                    <FileDetailBottomStyled>
                        <span>
                            {
                                fileSize/1000000000 >= 1 ? fileSize/1000000000 + " GB" 
                                : (fileSize/1000000 >= 1 ? fileSize/1000000 + " MB" 
                                : fileSize/1000 + " KB")
                            }
                        </span>
                        <DownloadFileIconStyled onClick={(e) => hanldleDownloadFile(e, fileNameS3, fileName)}>
                            <AiOutlineDownload/>
                        </DownloadFileIconStyled>
                    </FileDetailBottomStyled>
                </FileDetailStyled>
            </FileItemStyled>
        </div>
    )
}

export default FileItem