'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import SearchCategorySlider from "./SearchCategorySlider";
import Categorydropdown from "./CategoryDropdown";
import { searchApi } from "@/lib/api/search";
import { getSearchHistory } from "@/lib/search/actions";
import type { SuggestionItem } from "@/types/search";

const SUGGESTION_DEBOUNCE_MS = 250;

export default function HeadSearchBar(){
    const router = useRouter();
    const [term, setTerm] = useState("");
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* The signed-in shopper's recent searches -- empty, and quietly so, for a guest. */
    useEffect(() => {
        getSearchHistory().then(setHistory).catch(() => setHistory([]));
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const query = term.trim();
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(() => {
            searchApi.suggestions(query).then(setSuggestions).catch(() => setSuggestions([]));
        }, SUGGESTION_DEBOUNCE_MS);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [term]);

    function goToResults(query: string) {
        const trimmed = query.trim();
        if (!trimmed) return;
        router.push(`/search-result?q=${encodeURIComponent(trimmed)}`);
    }

    return(
        <div className="container">
            <form
                className="header-item-search"
                onSubmit={event => {
                    event.preventDefault();
                    goToResults(term);
                }}>
                <div className="input-group search-input">
                    <Categorydropdown />
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search Product"
                        value={term}
                        onChange={event => setTerm(event.target.value)}
                    />
                    <button className="btn" type="submit">
                        <i className="iconly-Light-Search"/>
                    </button>
                </div>

                {/* Live suggestions */}
                {suggestions.length > 0 && (
                    <ul className="recent-tag">
                        {suggestions.map((suggestion, index) => (
                            <li key={`${suggestion.title}-${index}`}>
                                <Link
                                    href={`/search-result?q=${encodeURIComponent(suggestion.title)}`}
                                    onClick={event => {
                                        event.preventDefault();
                                        goToResults(suggestion.title);
                                    }}>
                                    {suggestion.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Recent searches, for a signed-in shopper */}
                {suggestions.length === 0 && history.length > 0 && (
                    <ul className="recent-tag">
                        <li className="pe-0"><span>Recent :</span></li>
                        {history.map((entry, index) => (
                            <li key={`${entry}-${index}`}>
                                <Link
                                    href={`/search-result?q=${encodeURIComponent(entry)}`}
                                    onClick={event => {
                                        event.preventDefault();
                                        goToResults(entry);
                                    }}>
                                    {entry}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </form>
            <div className="row">
                <div className="col-xl-12">
                    <h5 className="mb-3">You May Also Like</h5>
                    <SearchCategorySlider />
                </div>
            </div>
        </div>
    )
}
