#!/bin/sh

rsync \
    --delete \
    --exclude='.git*' \
    --exclude='.buildpath*' \
    --exclude='.externalToolBuilders*' \
    --exclude='.project*' \
    --exclude='.settings*' \
    --exclude="sync*" \
    --exclude='.settings/' \
    -raLve "ssh" . git@github.com:pirra10/photo-beard.git

exit $?
