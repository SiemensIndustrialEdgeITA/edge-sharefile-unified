#!/bin/bash

#1:Username, 2:password, 3://ip/smb-share 4:directory 
smbclient -U $1%$2 $3 -c "cd $4; ls"

exit 

