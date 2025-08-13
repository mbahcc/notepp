#include "file-io/FileManager.h"
#include <fstream>
#include <sstream>
#include <iostream>

/**
 * @brief Saves content to a file with comprehensive error handling
 * @param filePath The full path where the file should be saved
 * @param content The text content to write to the file
 * @return true if file was saved successfully, false otherwise
 */

bool FileManager::saveFile(const std::string &filePath, const std::string &content) const
{

    std::ofstream outFile(filePath);

    if (!outFile.is_open())
    {
        std::cerr << "Error opening file for writing: " << filePath << std::endl;
        return false;
    }

    try
    {
        // Enable exception throwing for stream errors
        outFile.exceptions(std::ofstream::badbit | std::ofstream::failbit);

        outFile << content;

        return true;
    }
    catch (const std::ofstream::failure &e)
    {
        std::cerr << "File I/O error: " << e.what() << std::endl;
        return false;
    }
    catch (const std::exception &e)
    {
        std::cerr << "Standard exception: " << e.what() << std::endl;
        return false;
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred while saving file." << std::endl;
        return false;
    }
}

/**
 * @brief Reads content from a file with comprehensive error handling
 * @param filePath The full path of the file to read
 * @return Optional string containing file content, or nullopt if read failed
 */

std::optional<std::string> FileManager::readFile(const std::string &filePath) const
{
    std::ifstream inFile(filePath);

    if (!inFile.is_open())
    {
        std::cerr << "Error opening file for reading: " << filePath << std::endl;
        return std::nullopt;
    }

    try
    {
        // Enable exception throwing for stream errors
        inFile.exceptions(std::ifstream::badbit | std::ifstream::failbit);

        // Read entire file into string buffer
        std::stringstream buffer;
        buffer << inFile.rdbuf();
        return buffer.str();
    }
    catch (const std::ifstream::failure &e)
    {
        std::cerr << "File I/O error: " << e.what() << std::endl;
        return std::nullopt;
    }
    catch (const std::exception &e)
    {
        std::cerr << "Standard exception: " << e.what() << std::endl;
        return std::nullopt;
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred while reading file." << std::endl;
        return std::nullopt;
    }
}