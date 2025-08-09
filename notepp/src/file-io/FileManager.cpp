#include "FileManager.h"
#include <fstream>
#include <sstream>
#include <iostream>

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
        inFile.exceptions(std::ifstream::badbit | std::ifstream::failbit);

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