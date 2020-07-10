import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function Repository({className, repository}) {
    const license = repository.licenseInfo ? repository.licenseInfo.name : 'none';

    return (
        <Card className={className}>
            <CardContent>
                <h4>{repository.name} (stars: {repository.stargazers.totalCount}, license: {license})</h4>
                <h5>Owner: {repository.owner.login}</h5>
                <p>{repository.description}</p>
            </CardContent>
        </Card>
    )
}
