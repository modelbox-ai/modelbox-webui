#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

cmake_minimum_required(VERSION 3.10)

project(modelbox-editor-webui)

if (NOT MODELBOX_VERSION_MAJOR)
    set(MODELBOX_VERSION_MAJOR 1)
endif()

if (NOT MODELBOX_VERSION_MINOR)
    set(MODELBOX_VERSION_MINOR 0)
endif()

if (NOT MODELBOX_VERSION_PATCH)
    set(MODELBOX_VERSION_PATCH 0)
endif()

find_program(NPM npm)

set(MODELBOX_WEBUI_BUILD OFF CACHE INTERNAL "")
if(NOT NPM)
    message(STATUS "Skip build modelbox-editor-webui")
    return()
endif()
set(MODELBOX_WEBUI_BUILD ON CACHE INTERNAL "")

set(NODE_MODULES_PATH ${CMAKE_CURRENT_BINARY_DIR})
set(NG ${CMAKE_CURRENT_LIST_DIR}/node_modules/.bin/ng)

if (NOT EDITOR_UI_OUTPUT_DIR)
    set(EDITOR_UI_OUTPUT_DIR ${CMAKE_CURRENT_BINARY_DIR}/editor)
endif()

if (NOT EDITOR_UI_INSTALL_DIR)
    set(EDITOR_UI_INSTALL_DIR "/usr/local/share/modelbox/www")
endif()

set(EDITOR_UI_INSTALL_FLAG ${CMAKE_CURRENT_BINARY_DIR}/editorinstalled)
add_custom_target(modelbox-editor-webui  ALL
    DEPENDS ${EDITOR_UI_OUTPUT_DIR}/index.html
    )

add_custom_command(
    COMMENT "Building modelbox editor ui package.."
    OUTPUT ${EDITOR_UI_OUTPUT_DIR}/index.html
    WORKING_DIRECTORY ${CMAKE_CURRENT_LIST_DIR}
    COMMAND [ -d ${NODE_MODULES_PATH}/node_modules ] || mkdir -p ${NODE_MODULES_PATH}/node_modules
    COMMAND [ -d ${CMAKE_CURRENT_LIST_DIR}/node_modules ] || mv -f ${NODE_MODULES_PATH}/node_modules ${CMAKE_CURRENT_LIST_DIR}/
    COMMAND [ -e ${EDITOR_UI_INSTALL_FLAG} ] || PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true ${NPM} install
    COMMAND ${NPM} run prepare
    COMMAND NG_CLI_ANALYTICS=ci ${NG} build --output-path ${EDITOR_UI_OUTPUT_DIR}
    COMMAND mv -f ${CMAKE_CURRENT_LIST_DIR}/node_modules ${NODE_MODULES_PATH}/
    COMMAND touch ${EDITOR_UI_INSTALL_FLAG}
    )

install(DIRECTORY 
    ${EDITOR_UI_OUTPUT_DIR}
    DESTINATION ${EDITOR_UI_INSTALL_DIR}
    COMPONENT modelbox-webui
    )

add_subdirectory(package)