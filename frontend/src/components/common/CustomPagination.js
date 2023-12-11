//S. Khatri, “How to build a custom pagination component in react,” freeCodeCamp.org [Online]. Available: https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/ [Accessed July 12, 2023].

import React from 'react';

const CustomPagination = ({ pageCount, onPageChange, currentPageNumber, style }) => {
    const handlePreviousPageClick = () => {
        onPageChange({ selected: currentPageNumber - 1 });
    };

    const handleNextPageClick = () => {
        onPageChange({ selected: currentPageNumber + 1 });
    };

    const getPageNumbersPagination = () => {
        const visiblePageCount = 10;
        const pageNumbersArray = [];
        let startingPage = Math.max(0, currentPageNumber - Math.floor(visiblePageCount / 2));
        const endingPage = Math.min(pageCount - 1, startingPage + visiblePageCount - 1);

        if (pageCount > visiblePageCount) {
            if (endingPage === pageCount - 1) {
                startingPage = pageCount - visiblePageCount;
            } else if (startingPage === 0) {
                startingPage = 0;
            } else {
                startingPage = startingPage - 1;
            }
        }

        for (let i = startingPage; i <= endingPage; i++) {
            pageNumbersArray.push(i);
        }

        return pageNumbersArray;
    };

    const renderPageNumbersForPagination = () => {
        const pageNumbersArray = getPageNumbersPagination();

        return pageNumbersArray.map((pageNumber, index) => {
            return (
                <span
                    key={index}
                    style={pageNumber === currentPageNumber ? style.activePageNumberButton : style.pageNumberButton}
                    onClick={() => onPageChange({ selected: pageNumber })}
                >
                    {pageNumber + 1}
                </span>
            );
        });
    };

    return (
        <div style={style.pagination}>
            <span
                style={currentPageNumber === 0 ? { ...style.pageNumberButton, pointerEvents: 'none', opacity: 0.5 } : style.activePageNumberButton}
                onClick={handlePreviousPageClick}
            >
                Previous
            </span>
            {currentPageNumber > 0 && pageCount > 10 && (
                <>
                    <span style={style.pageNumberButton} onClick={() => onPageChange({ selected: 0 })}>
                        1
                    </span>
                    <span style={style.ellipsis}>...</span>
                </>
            )}
            {renderPageNumbersForPagination()}
            {currentPageNumber < pageCount - 1 && pageCount > 10 && (
                <>
                    <span style={style.ellipsis}>...</span>
                    <span style={style.pageNumberButton} onClick={() => onPageChange({ selected: pageCount - 1 })}>
                        {pageCount}
                    </span>
                </>
            )}
            <span
                style={currentPageNumber === pageCount - 1 ? { ...style.pageNumberButton, pointerEvents: 'none', opacity: 0.5 } : style.activePageNumberButton}
                onClick={handleNextPageClick}
            >
                Next
            </span>
        </div>
    );
};

export default CustomPagination;
