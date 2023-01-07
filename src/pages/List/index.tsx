import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';
import monthList from '../../utils/months';

import { 
    Container, 
    Content, 
    Filters 
} from './styles';

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

    const { type } = useParams();
    
    const pageData = useMemo(() => {
        return type === 'entry-balance' ?
        {
            title: 'Entradas',
            lineColor: '#F7931B',
            listData: gains
        } : {
            title: 'Saídas',
            lineColor: '#E44C4E',
            listData: expenses
        }
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
        
        pageData.listData.forEach(item => {
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
    }, [pageData.listData]);
    
    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<string>(String(new Date().getMonth() + 1));
    const [frequencyFilterSelected, setFrequencyFilterSelected] = useState(['recorrente', 'eventual'])
    const [yearSelected, setYearSelected] = useState<string>(String(years[years.length -1].value));
    
    const handleFrequencyClick = (frequency: string) => {
        const alreadySelected = frequencyFilterSelected.findIndex(item => item === frequency);

        if(alreadySelected >= 0) {
            const filtered = frequencyFilterSelected.filter(item => item !== frequency);
            setFrequencyFilterSelected(filtered);
        } else {
            setFrequencyFilterSelected((prev) => [...prev, frequency]);
        }
    }
    
    useEffect(() => {

        const filteredData = pageData.listData.filter(item => {
            const date = new Date(item.date);
            const month = String(date.getMonth() + 1);
            const year = String(date.getFullYear());

            return month === monthSelected && year === yearSelected 
                && frequencyFilterSelected.includes(item.frequency);
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
    }, [pageData.listData, monthSelected, yearSelected, frequencyFilterSelected])

    return (
        <Container>
            <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
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
                <button 
                    type="button"  
                    className={`tag-filter tag-filter-recurrent
                    ${frequencyFilterSelected.includes('recorrente') && 'tag-actived'}`}
                    onClick={() => handleFrequencyClick('recorrente')}
                    >
                    Recorrentes
                </button>

                <button 
                    type="button" 
                    className={`tag-filter tag-filter-eventual
                    ${frequencyFilterSelected.includes('eventual') && 'tag-actived'}`}
                    onClick={() => handleFrequencyClick('eventual')}
                >
                    Eventuais
                </button>
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