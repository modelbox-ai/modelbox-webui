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
set(CPACK_SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR} CACHE INTERNAL "")
set(CPACK_BINARY_DIR ${CMAKE_CURRENT_BINARY_DIR} CACHE INTERNAL "")
function(MODELBOX_CPACK)
    set(CPACK_RPM_COMPONENT_INSTALL ON PARENT_SCOPE)
    set(CPACK_DEB_COMPONENT_INSTALL ON PARENT_SCOPE)
    set(CPACK_ARCHIVE_COMPONENT_INSTALL OFF PARENT_SCOPE)
    set(CPACK_SET_DESTDIR ON PARENT_SCOPE)
    set(CPACK_STRIP_FILES ON PARENT_SCOPE)
    find_program(TAR tar)
    find_program(DPKG dpkg)
    find_program(RPM rpm)
    set(MODELBOX_PACK_NAME "${CPACK_PACKAGE_NAME}")
    if(NOT CPACK_PACKAGE_NAME)
        set(MODELBOX_PACK_NAME "${CMAKE_PROJECT_NAME}")
    endif()
    if(TAR) 
        set(CPACK_GENERATOR "${CPACK_GENERATOR}TGZ;")
    endif()
    if(DPKG) 
        set(CPACK_GENERATOR "${CPACK_GENERATOR}DEB;")
    endif()
    if(RPM) 
        set(CPACK_GENERATOR "${CPACK_GENERATOR}RPM;")
    endif()

    set(CPACK_GENERATOR "${CPACK_GENERATOR}" PARENT_SCOPE)
    set(CPACK_PACKAGE_RELOCATABLE OFF PARENT_SCOPE)
    set(CPACK_RPM_PACKAGE_AUTOREQ OFF PARENT_SCOPE)
    set(CPACK_RPM_EXCLUDE_FROM_AUTO_FILELIST_ADDITION
        "/usr/local"
        "/usr/local/bin"
        "/usr/local/lib"
        "/usr/local/lib64"
        "/usr/local/etc"
        "/usr/local/include"
        "/usr/lib/systemd"
        ${CMAKE_INSTALL_FULL_BINDIR}
        ${CMAKE_INSTALL_FULL_INCLUDEDIR}
        ${CMAKE_INSTALL_FULL_LIBDIR}
        "${CMAKE_INSTALL_FULL_LIBDIR}/pkgconfig"
        ${SYSTEMDSYSTEMUNITDIR} PARENT_SCOPEN)

    set(CPACK_OUTPUT_FILE_PREFIX ${RELEASE_PACKAGE_DIR} PARENT_SCOPE)
    set(CPACK_PACKAGE_DIRECTORY ${CMAKE_BINARY_DIR}/cpack PARENT_SCOPE)
    set(CPACK_DEBIAN_PACKAGE_MAINTAINER "Huawei Technologies Co., Ltd." PARENT_SCOPE)
    
    get_cmake_property(CPACK_COMPONENTS_ALL COMPONENTS)
    list(REMOVE_ITEM CPACK_COMPONENTS_ALL "Unspecified")
    set(CPACK_COMPONENTS_ALL ${CPACK_COMPONENTS_ALL} PARENT_SCOPE)
    
endfunction(MODELBOX_CPACK)
set(${MODELBOX_CPACK} ${MODELBOX_CPACK} CACHE INTERNAL "")
set(CPACK_PACKAGE_VERSION_MAJOR ${MODELBOX_VERSION_MAJOR})
set(CPACK_PACKAGE_VERSION_MINOR ${MODELBOX_VERSION_MINOR})
set(CPACK_PACKAGE_VERSION_PATCH ${MODELBOX_VERSION_PATCH})

if (NOT DISABLE_MODELBOX_CPACK)
    include(CPackComponent)
    MODELBOX_CPACK()
    include(CPack)
endif()
