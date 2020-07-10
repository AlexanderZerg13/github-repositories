import React, { useState, useCallback, Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import Repository from './repository';

import { GET_REPOSITORIES, GET_LICENSES } from '../../../api';

import './index.css';

const PAGE_COUNT = 10;

function prepareQuery(search, license) {
    const queries = [];
    if (search) {
        queries.push(search);
    }
    if (license) {
        queries.push(`license:${license}`);
    }
    queries.push('language:javascript');
    queries.push(`created:>${moment().add(-1, 'month').format('YYYY-MM-DD')}`);
    queries.push('sort:stars');

    return queries.join(' ');
}

function Main() {
    const [inputValue, setInputValue] = useState('');
    const [licenseValue, setLicenseValue] = useState('');

    const { loading: licenseLoading, data: licenseData } = useQuery(GET_LICENSES);
    const { loading: repositoriesLoading, data: repositoriesData, refetch } = useQuery(GET_REPOSITORIES, {
        variables: {
            query: prepareQuery(),
            first: PAGE_COUNT
        },
    });
    const loading = licenseLoading || repositoriesLoading;
    const licenses = licenseData ? licenseData.licenses : [];
    const repositories = repositoriesData ? repositoriesData.search.nodes : [];
    const pageInfo = repositoriesData ? repositoriesData.search.pageInfo : {};

    const prepareVariables = useCallback(({after, first, before, last}) => {
        const license = licenseValue && licenses.find(item => item.id === licenseValue).key;

        return ({
            query: prepareQuery(inputValue, license),
            after,
            first,
            before,
            last
        });
    }, [inputValue, licenseValue, licenses])

    const handleInputChange = useCallback(event => {setInputValue(event.target.value)}, []);
    const handleSelectChange = useCallback(event => {setLicenseValue(event.target.value)}, []);
    const handleSearch = useCallback(() => refetch(prepareVariables({first: PAGE_COUNT})), [refetch, prepareVariables]);
    const handleNext = useCallback(() => {
        refetch(prepareVariables({after: pageInfo.endCursor, first: PAGE_COUNT}));
        window.scrollTo(0, 0)
    }, [refetch, prepareVariables, pageInfo.endCursor]);

    const handlePrevious = useCallback(() => {
        refetch(prepareVariables({before: pageInfo.startCursor, last: PAGE_COUNT}));
        window.scrollTo(0, 0)
    }, [refetch, prepareVariables, pageInfo.startCursor]);

    return (
        <Container className="Main" maxWidth="md">
            <form className="Main__Form Form">
                <TextField
                    className="Form__input"
                    label="Название проекта..."
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <FormControl className="Form__license">
                    <InputLabel id="license">Тип лицензции</InputLabel>
                    <Select
                        labelId="license"
                        id="demo-simple-select-helper"
                        value={licenseValue}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {licenses.map(lisense => (
                            <MenuItem key={lisense.id} value={lisense.id}>{lisense.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    className="Form__search"
                    variant="contained"
                    onClick={handleSearch}
                >
                    Поиск
                </Button>
            </form>
            {loading && (
                <div className="Main__circularProgressContainer">
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <Fragment>
                    <div className="Main__repositoriesList">
                        {repositories.map(repository => (
                            <Repository key={repository.id} className="Main__Repository" repository={repository} />
                        ))}
                    </div>
                    <div className="Main__pagination">
                        <Button
                            variant="contained"
                            disabled={!pageInfo.hasPreviousPage}
                            onClick={handlePrevious}
                        >
                            Назад
                        </Button>
                        <Button
                            variant="contained"
                            disabled={!pageInfo.hasNextPage}
                            onClick={handleNext}
                        >
                            Вперед
                        </Button>
                    </div>
                </Fragment>
            )}
        </Container>
    );
}

export default Main;
