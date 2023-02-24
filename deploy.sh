#!/bin/sh
#cleans, installs, commits & pushes to deploy to github
#Should have a commit message, otherwise defaults to - "Update"
NUMARGS="$#"
if (( $# > 0 )) ; then
	MSG="$*"
else 
  MSG="UPDATE"
fi

#echo The Quoted Msg: \"$MSG\" 
npm run clean
npm install
git commit -a -m "\"$MSG\" " 
git push
#echo "The args are: [$*], MSG: [$MSG]; numargs: [$NUMARGS]; CMPT: [$CMPT]; CMPF: [$CMPF]"
