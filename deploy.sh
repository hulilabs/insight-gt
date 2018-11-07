#!/bin/bash

# validate the tag
if [ -z "$1" ]; then
    echo $0: no tag was provided.
    echo $0: usage: /deploy.sh tag commit_id
    exit 1
fi
tag=$1

# validate the commit id
if [ -z "$2" ]; then
    echo $0: no commit id was provided.
    echo $0: usage: /deploy.sh commit_id
    exit 1
fi
commit_id=$2

# set the version tag
version=$tag

# set the default cpu and reserve memory values
reserve_cpu="0.01"
reserve_memory="5m"

# change the tag to latest when master was sent.
# also set the version to the commit id instead of latest.
if [ "$tag" = "master" ]; then
    tag="latest"
    version=$commit_id
fi

# create the service if not exists, update otherwise
sudo docker service ls | grep -q " insight-gt "
if [ $? -eq 1 ]; then
    sudo docker service create \
        --constraint 'node.labels.group == internal' \
        --container-label version="$version" \
        --detach=false \
        --log-driver syslog \
        --log-opt tag=insight-gt \
        --name insight-gt \
        --network huli \
        --replicas 2 \
        --reserve-cpu $reserve_cpu \
        --reserve-memory $reserve_memory \
        --rollback-delay 10s \
        --rollback-monitor 30s \
        --rollback-order 'start-first' \
        --rollback-parallelism 1 \
        --update-delay 10s \
        --update-failure-action 'rollback' \
        --update-monitor 30s \
        --update-order 'start-first' \
        --update-parallelism 0 \
        --with-registry-auth \
        huli/insight-gt:$tag \
    || { echo $0: Failed to create insight-gt; exit 1; }
else
    sudo docker service update \
        --container-label-add version="$version" \
        --detach=false \
        --force \
        --image huli/insight-gt:$tag \
        --log-driver syslog \
        --log-opt tag=insight-gt \
        --reserve-cpu $reserve_cpu \
        --reserve-memory $reserve_memory \
        --rollback-delay 10s \
        --rollback-monitor 30s \
        --rollback-order 'start-first' \
        --rollback-parallelism 1 \
        --update-delay 10s \
        --update-failure-action 'rollback' \
        --update-monitor 30s \
        --update-order 'start-first' \
        --update-parallelism 0 \
        insight-gt \
    || { echo $0: Failed to update insight-gt; exit 1; }
fi

exit 0
