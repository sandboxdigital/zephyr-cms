# Zephyr CMS #

- Version: 0.0.1
- Date: September 27th, 2016
- Release Notes:
- Licenced under MIT: http://www.opensource.org/licenses/mit-license.php
- Github Repository: https://github.com/sandboxdigital/zephyr-cms

## Overview

Zephyr CMS is a PHP & Javascript CMS - it's built to be framework agnostic and should work with multiple PHP environments. 
As of version "1.0.0" it will be considered stable.

### Connectors

We're working on a series of connectors to easily integrate Zephyr with existing PHP frameworks. You can fine existing connectors here:

- Coming soon

### Server Requirements

- PHP 5.2 or above
- MySQL 5.0 or above
- An Nginx, Apache or Litespeed webserver


## Installation

1. Clone:
git clone git://github.com/sandboxdigital/zephyr-cms.git

git submodule init

git submodule update

3. Create your MySQL database

4. Download Zend and copy Zend folder to /public_html/library

4. Point Apache to /public_html

5. Grant the following folders (and subfolders) read/write access:
/public_html/file
/public_html/application/storage

6. Run http://localhost/installer.php

7. Access site:
http://localhost/

8. Access CMS admin with the following details:
http://localhost/admin
email: superuser@zephyrcms.com
pass: password

email: admin@zephyrcms.com
pass: password