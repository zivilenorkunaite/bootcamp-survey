import { DataLakeStorageFileSystemClient } from "@azure/storage-file-datalake";

const accountName = process.env.REACT_APP_AZURE_ACCOUNT_NAME;
const fileSystemName = process.env.REACT_APP_AZURE_FILE_SYSTEM_NAME;
const directoryName = process.env.REACT_APP_AZURE_DIRECTORY_NAME;

const dataLakeFileSystemClient = new DataLakeStorageFileSystemClient(
  `https://${accountName}.dfs.core.windows.net`,
  process.env.REACT_APP_AZURE_STORAGE_SHARED_KEY
);

const uploadFileToADLS = async (filename, data) => {
  const directoryClient =
    dataLakeFileSystemClient.getDirectoryClient(directoryName);
  const fileClient = directoryClient.getFileClient(filename);

  try {
    const response = await fileClient.create(data.length);
    if (response.fileSize !== data.length) {
      throw new Error("Failed to create file with matching size");
    }
    const buffer = Buffer.from(data);
    const result = await fileClient.append(buffer, 0, buffer.length);
    await fileClient.flush(data.length);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


=====



import { DataLakeServiceClient } from "@azure/storage-file-datalake";

const accountName = process.env.REACT_APP_AZURE_ACCOUNT_NAME;
const fileSystemName = process.env.REACT_APP_AZURE_FILE_SYSTEM_NAME;
const directoryName = process.env.REACT_APP_AZURE_DIRECTORY_NAME;

const sharedKeyCredential = {
  accountName: process.env.REACT_APP_AZURE_ACCOUNT_NAME,
  accountKey: process.env.REACT_APP_AZURE_STORAGE_SHARED_KEY,
};

const dataLakeServiceClient = new DataLakeServiceClient(
  `https://${accountName}.dfs.core.windows.net`,
  sharedKeyCredential
);

const uploadFileToADLS = async (filename, data) => {
  const fileSystemClient =
    dataLakeServiceClient.getFileSystemClient(fileSystemName);
  const directoryClient = fileSystemClient.getDirectoryClient(directoryName);
  const fileClient = directoryClient.getFileClient(filename);

  try {
    const response = await fileClient.create(data.length);
    if (response.fileSize !== data.length) {
      throw new Error("Failed to create file with matching size");
    }
    const buffer = Buffer.from(data);
    const result = await fileClient.append(buffer, 0, buffer.length);
    await fileClient.flush(data.length);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};