"""Tests for CV/LinkedIn field guessing."""

from src.services.cv_parser import guess_candidate_fields, guess_name_from_linkedin_title


class TestGuessNameFromLinkedinTitle:
    def test_extracts_name_before_the_first_separator(self):
        assert (
            guess_name_from_linkedin_title("Jordan Rivera - Senior Data Engineer - Avanade | LinkedIn")
            == "Jordan Rivera"
        )

    def test_handles_en_dash_separator(self):
        assert guess_name_from_linkedin_title("Jordan Rivera – Senior Data Engineer | LinkedIn") == "Jordan Rivera"

    def test_handles_title_with_no_trailing_linkedin_suffix(self):
        assert guess_name_from_linkedin_title("Jordan Rivera - Senior Data Engineer") == "Jordan Rivera"

    def test_handles_name_only_title(self):
        assert guess_name_from_linkedin_title("Jordan Rivera | LinkedIn") == "Jordan Rivera"

    def test_rejects_a_non_name_first_segment(self):
        # A headline-first title (no separator before a long non-name chunk)
        # must not be mistaken for a person's name.
        assert guess_name_from_linkedin_title("Senior Data Engineer with 9 years of experience") is None

    def test_rejects_a_segment_with_digits(self):
        assert guess_name_from_linkedin_title("Team 42 - Some Page | LinkedIn") is None

    def test_handles_empty_or_missing_title(self):
        assert guess_name_from_linkedin_title("") is None
        assert guess_name_from_linkedin_title(None) is None


class TestGuessCandidateFields:
    def test_finds_name_email_and_years(self):
        cv = "Maria Souza\nmaria@example.com\n12 years of experience in data.\n"
        fields = guess_candidate_fields(cv)
        assert fields["name"] == "Maria Souza"
        assert fields["email"] == "maria@example.com"
        assert fields["total_years_experience"] == 12

    def test_returns_partial_fields_when_no_name_line_matches(self):
        """An email-only CV must not silently produce a fabricated name —
        callers rely on 'name' being absent, not empty, to trigger fallback."""
        cv = "contact: someone@example.com\n1234\n5678\n"
        fields = guess_candidate_fields(cv)
        assert "name" not in fields
        assert fields["email"] == "someone@example.com"
