#!/bin/bash

echo "putting $5 to $6"
#1:Username, 2:password, 3://ip/directory 4:filepath 5:filename 6:destination path
cd $4
smbclient -U "$1""%$2" "$3" -c "cd $6; put $5"

exit 

