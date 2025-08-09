#include "file-io/FileManager.h"
#include <napi.h>

// C++ class wrapper for saveFile method

Napi::Boolean SaveFileWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString())
    {
        Napi::TypeError::New(env, "Expected two string arguments: filePath and content").ThrowAsJavaScriptException();
    }
    std::string filePath = info[0].As<Napi::String>().Utf8Value();
    std::string content = info[1].As<Napi::String>().Utf8Value();

    FileManager fileManager;
    bool result = fileManager.saveFile(filePath, content);

    return Napi::Boolean::New(env, result);
}

// C++ class wrapper for readFile method

Napi::Value ReadFileWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString())
    {
        Napi::TypeError::New(env, "Expected one string argument: filePath").ThrowAsJavaScriptException();
    }

    std::string filePath = info[0].As<Napi::String>().Utf8Value();

    FileManager fileManager;
    std::optional<std::string> content = fileManager.readFile(filePath);

    if (content.has_value())
    {
        return Napi::String::New(env, content.value());
    }
    else
    {
        return env.Null();
    }
}

// Define objects that will be exported to Node.js

Napi::Object Init(Napi::Env env, Napi::Object exports)
{

    exports.Set("saveFile", Napi::Function::New(env, SaveFileWrapped));
    exports.Set("readFile", Napi::Function::New(env, ReadFileWrapped));
    return exports;
}

// Register the addon with Node.js

NODE_API_MODULE(addon, Init);