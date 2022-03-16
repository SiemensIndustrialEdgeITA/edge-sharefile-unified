#!/bin/bash

echo "deleting $4"
#1:Username, 2:password, 3://ip/directory 4:filepath with file to delete
smbclient -U "$1""%$2" "$3" -c "rm $4"

exit 

