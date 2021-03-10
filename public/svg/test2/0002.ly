\version "2.22.0"
\language "english"

\include "/home/yako/.local/share/SuperCollider/Extensions/fosc/stylesheets/default.ily"

\score {
    \new Score <<
        \new Staff {
            e'4
            -\nil
            -\markup { 1 }
        }
    >>
}