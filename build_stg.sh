#!/bin/bash
#This script is used to complete the process of build staging

cnpm install
forever -a start main.js ;
