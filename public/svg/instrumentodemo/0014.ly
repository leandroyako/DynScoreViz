\version "2.22.0"
\language "english"

\include "/home/yako/.local/share/SuperCollider/Extensions/fosc/stylesheets/default.ily"

\score {
    \new Score <<
        \new Staff {
            a''16
            -\staccato
            f''16
            -\accent
            e'16
            -\marcato
            e''16
            -\nil
            e'16
            -\staccato
            b'16
            -\accent
            a'16
            -\marcato
            f'16
            -\nil
            g''16
            -\staccato
            e'16
            -\accent
            g'16
            -\marcato
            b'16
            -\nil
            d'16
            -\staccato
            a'16
            -\accent
            f'16
            -\marcato
            f''16
            -\nil
        }
    >>
}