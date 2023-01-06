import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';

import { Container, Content, Filters } from './styles';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';
import monthList from '../../utils/months';

interface IData {
    id: string;
    description: string;
    amountFormatted: string;
    type: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC = () => {
    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<string>(String(new Date().getMonth() + 1));
    
    const { type } = useParams();
    
    const title = useMemo(() => {
        return type === 'entry-balance' ?
        {
            title: 'Entradas',
            lineColor: '#F7931B'
            } : {
                title: 'Saídas',
                lineColor: '#E44C4E'
            }
        }, [type]);
        
        const listData = useMemo(() => {
            return type === 'entry-balance' ? gains : expenses;
        }, [type]);
        
        const months = useMemo(() => {
            return monthList.map((month, index) => {
                return {
                    value: String(index + 1),
                label: month,
            }
        })
        
    }, []);
    
    const years = useMemo(() => {
        let uniqueYears: number[] = [];

        listData.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            
            if (!uniqueYears.includes(year)) {
                uniqueYears.push(year);
            }
        });
        
        return uniqueYears.map(year => {
            return {
                value: year,
                label: year,
            };
        });
    }, [listData]);

    const [yearSelected, setYearSelected] = useState<string>(String(years[years.length -1].value));
    
    useEffect(() => {

        const filteredData = listData.filter(item => {
            const date = new Date(item.date);
            const month = String(date.getMonth() + 1);
            const year = String(date.getFullYear());

            return month === monthSelected && year === yearSelected;
            
        });

        const response = filteredData.map(item => {
            return {
                id: String((Math.random() * 123) + new Date().getTime() + (Math.random() * 123)),
                description: item.description,
                amountFormatted: formatCurrency(Number(item.amount)),
                type: item.type,
                frequency: item.frequency,
                dateFormatted: formatDate(item.date),
                tagColor: item.frequency === 'recorrente' ? '#4341F0' : '#E44C4E'
            }
        });


        setData(response)
    }, [listData, monthSelected, yearSelected])

    return (
        <Container>
            <ContentHeader title={title.title} lineColor={title.lineColor}>
                <SelectInput 
                    options={months} 
                    onChange={(e) => setMonthSelected(e.target.value)} 
                    defaultValue={monthSelected} />
                <SelectInput 
                    options={years} 
                    onChange={(e) => setYearSelected(e.target.value)} 
                    defaultValue={yearSelected} />
            </ContentHeader>

            <Filters>
                <button type="button" className='tag-filter tag-filter-recurrent'>Recorrentes</button>
                <button type="button" className='tag-filter tag-filter-eventual'>Eventuais</button>
            </Filters>

            <Content>
                {
                    data.map(item => (
                        <HistoryFinanceCard
                            key={item.id}
                            tagColor={item.tagColor}
                            title={item.description}
                            subtitle={item.dateFormatted}
                            amount={item.amountFormatted}
                        />
                    ))
                }
            </Content>
        </Container>
    )
}

export default List;