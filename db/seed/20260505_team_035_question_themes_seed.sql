-- TEAM_035: Seed question_themes and assign questions.theme_id
begin;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('VERBAL')) then
    raise exception 'missing subtopics.name: VERBAL';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'VERBAL_ANALOGI', 'Analogi'
from subtopics qst
where upper(qst.name) = upper('VERBAL')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('VERBAL')) then
    raise exception 'missing subtopics.name: VERBAL';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'VERBAL_SINONIM', 'Sinonim'
from subtopics qst
where upper(qst.name) = upper('VERBAL')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('VERBAL')) then
    raise exception 'missing subtopics.name: VERBAL';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'VERBAL_ANTONIM', 'Antonim'
from subtopics qst
where upper(qst.name) = upper('VERBAL')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('VERBAL')) then
    raise exception 'missing subtopics.name: VERBAL';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'VERBAL_SILOGISME', 'Silogisme'
from subtopics qst
where upper(qst.name) = upper('VERBAL')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('VERBAL')) then
    raise exception 'missing subtopics.name: VERBAL';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'VERBAL_LOGIKA_ANALITIS', 'Logika Analitis'
from subtopics qst
where upper(qst.name) = upper('VERBAL')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('NUMERIK')) then
    raise exception 'missing subtopics.name: NUMERIK';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'NUMERIK_ARITMATIKA_PECAHAN', 'Aritmatika Pecahan'
from subtopics qst
where upper(qst.name) = upper('NUMERIK')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('NUMERIK')) then
    raise exception 'missing subtopics.name: NUMERIK';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'NUMERIK_DERET_ANGKA', 'Deret Angka'
from subtopics qst
where upper(qst.name) = upper('NUMERIK')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('NUMERIK')) then
    raise exception 'missing subtopics.name: NUMERIK';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'NUMERIK_PERBANDINGAN', 'Perbandingan'
from subtopics qst
where upper(qst.name) = upper('NUMERIK')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('NUMERIK')) then
    raise exception 'missing subtopics.name: NUMERIK';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'NUMERIK_SOAL_CERITA', 'Soal Cerita Matematika'
from subtopics qst
where upper(qst.name) = upper('NUMERIK')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('NUMERIK')) then
    raise exception 'missing subtopics.name: NUMERIK';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'NUMERIK_ALJABAR', 'Aljabar Sederhana'
from subtopics qst
where upper(qst.name) = upper('NUMERIK')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('NUMERIK')) then
    raise exception 'missing subtopics.name: NUMERIK';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'NUMERIK_LOGIKA_MATEMATIKA', 'Logika Matematika'
from subtopics qst
where upper(qst.name) = upper('NUMERIK')
on conflict (subtopic_id, code) do update set name = excluded.name;
do $$ begin
  if not exists (select 1 from subtopics where upper(name) = upper('NUMERIK')) then
    raise exception 'missing subtopics.name: NUMERIK';
  end if;
end $$;
insert into question_themes (subtopic_id, code, name)
select qst.id, 'NUMERIK_GEOMETRI', 'Geometri'
from subtopics qst
where upper(qst.name) = upper('NUMERIK')
on conflict (subtopic_id, code) do update set name = excluded.name;
commit;
