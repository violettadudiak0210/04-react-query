import css from './App.module.css';
import { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import  { Toaster, toast } from 'react-hot-toast';

export default function App() {
    const [query, setQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const {data, isSuccess, isLoading, isError} = useQuery({
        queryKey: ['movies', query, currentPage],
        queryFn: () => fetchMovies(query, currentPage),
        enabled: query !== "",
        placeholderData: keepPreviousData,
    })

    const totalPages = data?.total_pages ?? 0;

    const handleSubmit = async (newquery: string) => {
        setQuery(newquery);
        setCurrentPage(1);
    };

    const handleSelect = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };
    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    useEffect(() => {
        if (isSuccess && data?.results.length === 0) {
            toast('No movies found for your request.',);
        }
    }, [isSuccess, data]);


    return (<div className={css.app}>
    <Toaster />
    <SearchBar 
    onSubmit={handleSubmit} 
    />
    {isSuccess && totalPages > 1 && (
       <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }: {selected: number}) => setCurrentPage(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
        />
    )}
    {isSuccess && data.results.length > 0 && 
    <MovieGrid 
    onSelect={handleSelect} 
    movies={data.results} 
    />
    }
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {isModalOpen && selectedMovie && (
        <MovieModal 
        movie={selectedMovie} 
        onClose={handleClose} 
        />
    )}
    </div>)
}