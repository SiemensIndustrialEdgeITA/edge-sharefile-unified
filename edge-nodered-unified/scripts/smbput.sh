#!/bin/bash

echo "putting $5 to $6"
#1:Username, 2:password, 3://ip/directory 4:filepath_hmi 5:filename 6:filepath_smb
cd $4
smbclient -U "$1""%$2" "$3" -c "cd $6; get $5"

exit 

