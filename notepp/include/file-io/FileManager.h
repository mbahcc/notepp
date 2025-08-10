#pragma once
#include <string>
#include <optional>

/**
 * @class FileManager
 * @brief Handles file I/O operations for the notepp application
 *
 * Provides functionality to read from and write to files on the filesystem.
 */

class FileManager
{
private:
    std::string filePath;
    std::string fileName;

public:
    FileManager(const std::string &path, const std::string &name);
    FileManager() = default;

    bool saveFile(const std::string &filePath, const std::string &content) const;
    std::optional<std::string> readFile(const std::string &filePath) const;
};
